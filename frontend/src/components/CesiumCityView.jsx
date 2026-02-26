/**
 * CesiumCityView — Cesium.js 3D globe visualization of Chennai.
 *
 * Renders each zone as a color-coded column on a real 3D globe with
 * satellite imagery. Column height ∝ AQI, color = risk level.
 * Click zones to select, hover for tooltips.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

// ── City Camera Positions ──────────────────────────────────────────
const CITY_CAMERA = {
    chennai: { lng: 80.20, lat: 13.04, alt: 35000 },
    mumbai: { lng: 72.86, lat: 19.06, alt: 35000 },
    delhi: { lng: 77.15, lat: 28.60, alt: 35000 },
    '': { lng: 78.96, lat: 20.59, alt: 3000000 }, // All India view
};

// ── Risk Colors ────────────────────────────────────────────────────
const RISK_CESIUM_COLORS = {
    Critical: Cesium.Color.fromCssColorString('#ef4444').withAlpha(0.85),
    High: Cesium.Color.fromCssColorString('#f97316').withAlpha(0.85),
    Medium: Cesium.Color.fromCssColorString('#eab308').withAlpha(0.85),
    Low: Cesium.Color.fromCssColorString('#22c55e').withAlpha(0.85),
};

const RISK_OUTLINE_COLORS = {
    Critical: Cesium.Color.fromCssColorString('#ef4444'),
    High: Cesium.Color.fromCssColorString('#f97316'),
    Medium: Cesium.Color.fromCssColorString('#eab308'),
    Low: Cesium.Color.fromCssColorString('#22c55e'),
};

export default function CesiumCityView({ zones, selectedZoneId, onSelectZone, selectedCity = '' }) {
    const viewerRef = useRef(null);
    const containerRef = useRef(null);
    const entitiesRef = useRef({});
    const [tooltipInfo, setTooltipInfo] = useState(null);

    // ── Initialize Viewer ──────────────────────────────────────────
    useEffect(() => {
        if (!containerRef.current || viewerRef.current) return;

        // Set Cesium Ion access token for satellite imagery + 3D terrain
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNDhlZTc0Yy04MWVlLTQ2ZTktODM4MC1hZjdjZjA4M2VhNzciLCJpZCI6Mzk0NjYyLCJpYXQiOjE3NzIwODk2OTB9.ctgGBmAS3iSyYvRJLsD5H2geMvaHHDj1Py5JwgvsV3E';

        const viewer = new Cesium.Viewer(containerRef.current, {
            baseLayerPicker: false,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            animation: false,
            timeline: false,
            fullscreenButton: false,
            selectionIndicator: false,
            infoBox: false,
            terrain: Cesium.Terrain.fromWorldTerrain(),
        });

        // Dark mode styling
        viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#f8fafc');
        viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#f8fafc');
        viewer.scene.fog.enabled = true;
        viewer.scene.globe.enableLighting = true;

        // Remove credit display clutter
        viewer.cesiumWidget.creditContainer.style.display = 'none';

        // Wait to fly until data loads (handled in another useEffect)

        // Click handler
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction((click) => {
            const picked = viewer.scene.pick(click.position);
            if (Cesium.defined(picked) && picked.id && picked.id._zoneId) {
                onSelectZone(picked.id._zoneId);
            } else {
                onSelectZone(null);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // Hover handler for tooltips
        handler.setInputAction((movement) => {
            const picked = viewer.scene.pick(movement.endPosition);
            if (Cesium.defined(picked) && picked.id && picked.id._zoneData) {
                const zone = picked.id._zoneData;
                setTooltipInfo({
                    x: movement.endPosition.x,
                    y: movement.endPosition.y,
                    zone,
                });
                document.body.style.cursor = 'pointer';
            } else {
                setTooltipInfo(null);
                document.body.style.cursor = 'default';
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        viewerRef.current = viewer;

        return () => {
            handler.destroy();
            viewer.destroy();
            viewerRef.current = null;
        };
    }, []);

    // ── Update Zone Entities ───────────────────────────────────────
    const updateEntities = useCallback(() => {
        const viewer = viewerRef.current;
        if (!viewer || !zones) return;

        // Remove old entities
        viewer.entities.removeAll();
        entitiesRef.current = {};

        zones.forEach((zone) => {
            const riskColor = RISK_CESIUM_COLORS[zone.risk_level] || RISK_CESIUM_COLORS.Medium;
            const outlineColor = RISK_OUTLINE_COLORS[zone.risk_level] || RISK_OUTLINE_COLORS.Medium;
            const isSelected = zone.id === selectedZoneId;

            // Column height based on AQI (taller = worse air quality)
            const height = Math.max(500, zone.current_aqi * 30);

            // Main zone column
            const entity = viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(zone.lng, zone.lat, height / 2),
                cylinder: {
                    length: height,
                    topRadius: isSelected ? 400 : 300,
                    bottomRadius: isSelected ? 400 : 300,
                    material: isSelected ? riskColor.withAlpha(0.95) : riskColor,
                    outline: true,
                    outlineColor: outlineColor,
                    outlineWidth: isSelected ? 3 : 1,
                },
                label: {
                    text: `${zone.name}\nAQI: ${zone.current_aqi}`,
                    font: isSelected ? '14px Inter, sans-serif' : '12px Inter, sans-serif',
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -10),
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    showBackground: true,
                    backgroundColor: Cesium.Color.fromCssColorString('#ffffff').withAlpha(0.85),
                    backgroundPadding: new Cesium.Cartesian2(8, 5),
                },
            });

            // Ground circle marker
            viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(zone.lng, zone.lat),
                ellipse: {
                    semiMinorAxis: isSelected ? 500 : 350,
                    semiMajorAxis: isSelected ? 500 : 350,
                    material: riskColor.withAlpha(isSelected ? 0.25 : 0.12),
                    outline: true,
                    outlineColor: outlineColor.withAlpha(0.4),
                },
            });

            // Store zone data on entity for click/hover
            entity._zoneId = zone.id;
            entity._zoneData = zone;
            entitiesRef.current[zone.id] = entity;
        });
    }, [zones, selectedZoneId]);

    useEffect(() => {
        updateEntities();
    }, [updateEntities]);

    // ── Fly to selected zone ───────────────────────────────────────
    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer || !selectedZoneId) return;

        const zone = zones?.find(z => z.id === selectedZoneId);
        if (!zone) return;

        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(zone.lng, zone.lat, 15000),
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-40),
                roll: 0,
            },
            duration: 1.5,
        });
    }, [selectedZoneId, zones]);

    // ── Fly to city when city selector changes or initial load ────
    const lastFlownCityRef = useRef(null);

    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer || !zones || zones.length === 0) return;

        // Ensure we only trigger the city flyTo when the user actually changes the city
        // (or on the very first load)
        if (lastFlownCityRef.current === selectedCity) return;
        lastFlownCityRef.current = selectedCity;

        // If a specific city is selected, fly to it
        if (selectedCity) {
            const cam = CITY_CAMERA[selectedCity];
            if (cam) {
                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(cam.lng, cam.lat, cam.alt),
                    orientation: {
                        heading: Cesium.Math.toRadians(0),
                        pitch: Cesium.Math.toRadians(-45),
                        roll: 0,
                    },
                    duration: 2,
                });
            }
        }
        // If NO selection (All Cities), find the absolute worst zone and zoom to it
        else if (selectedCity === '') {
            // Find the zone with the highest AQI
            const worstZone = [...zones].sort((a, b) => b.current_aqi - a.current_aqi)[0];

            if (worstZone) {
                // Determine which city this zone belongs to (or just fly directly to the zone but pulled back a bit)
                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(worstZone.lng, worstZone.lat, 40000),
                    orientation: {
                        heading: Cesium.Math.toRadians(0),
                        pitch: Cesium.Math.toRadians(-45),
                        roll: 0,
                    },
                    duration: 2.5,
                });

                // Auto-select it so the detail card opens up
                if (!selectedZoneId) {
                    onSelectZone(worstZone.id);
                }
            } else {
                // Fallback India view
                const cam = CITY_CAMERA[''];
                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(cam.lng, cam.lat, cam.alt),
                    orientation: {
                        heading: Cesium.Math.toRadians(0),
                        pitch: Cesium.Math.toRadians(-90),
                        roll: 0,
                    },
                    duration: 2,
                });
            }
        }
    }, [selectedCity, zones, selectedZoneId, onSelectZone]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 16,
                    overflow: 'hidden',
                }}
            />

            {/* Hover Tooltip */}
            {tooltipInfo && (
                <div
                    style={{
                        position: 'absolute',
                        left: tooltipInfo.x + 15,
                        top: tooltipInfo.y - 10,
                        background: 'rgba(255, 255, 255, 0.92)',
                        border: `1px solid ${tooltipInfo.zone.risk_color || '#3b82f6'}`,
                        borderRadius: 10,
                        padding: '10px 14px',
                        pointerEvents: 'none',
                        zIndex: 100,
                        minWidth: 160,
                        backdropFilter: 'blur(8px)',
                    }}
                >
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: '#0f172a' }}>
                        {tooltipInfo.zone.name}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', fontSize: 12 }}>
                        <span style={{ color: '#94a3b8' }}>AQI</span>
                        <span style={{ color: tooltipInfo.zone.risk_color, fontWeight: 600 }}>
                            {tooltipInfo.zone.current_aqi}
                        </span>
                        <span style={{ color: '#94a3b8' }}>CO₂</span>
                        <span style={{ color: tooltipInfo.zone.risk_color, fontWeight: 600 }}>
                            {tooltipInfo.zone.current_co2_ppm} ppm
                        </span>
                        <span style={{ color: '#94a3b8' }}>Temp</span>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>
                            {tooltipInfo.zone.avg_temperature_c?.toFixed(1)}°C
                        </span>
                        <span style={{ color: '#94a3b8' }}>Risk</span>
                        <span style={{ color: tooltipInfo.zone.risk_color, fontWeight: 600 }}>
                            {tooltipInfo.zone.risk_level}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
