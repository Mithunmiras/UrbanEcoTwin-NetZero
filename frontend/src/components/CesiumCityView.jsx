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
    chennai: { lng: 80.22, lat: 13.03, alt: 45000 },
    mumbai: { lng: 72.88, lat: 19.08, alt: 50000 },
    delhi: { lng: 77.21, lat: 28.61, alt: 55000 },
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
        viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#0a0f1a');
        viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#0a0f1a');
        viewer.scene.fog.enabled = true;
        viewer.scene.globe.enableLighting = true;

        // Remove credit display clutter
        viewer.cesiumWidget.creditContainer.style.display = 'none';

        // Fly to Chennai
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(80.22, 13.03, 45000),
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-45),
                roll: 0,
            },
            duration: 2,
        });

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
                    backgroundColor: Cesium.Color.fromCssColorString('#0a0f1a').withAlpha(0.8),
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

    // ── Fly to city when city selector changes ────────────────────
    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer) return;

        const cam = CITY_CAMERA[selectedCity] || CITY_CAMERA[''];
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(cam.lng, cam.lat, cam.alt),
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-45),
                roll: 0,
            },
            duration: 2,
        });
    }, [selectedCity]);

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
                        background: 'rgba(10, 15, 26, 0.92)',
                        border: `1px solid ${tooltipInfo.zone.risk_color || '#3b82f6'}`,
                        borderRadius: 10,
                        padding: '10px 14px',
                        pointerEvents: 'none',
                        zIndex: 100,
                        minWidth: 160,
                        backdropFilter: 'blur(8px)',
                    }}
                >
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: '#f1f5f9' }}>
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
                        <span style={{ fontWeight: 600, color: '#f1f5f9' }}>
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
