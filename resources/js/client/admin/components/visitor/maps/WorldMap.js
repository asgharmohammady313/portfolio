import React from 'react';
import PropTypes from 'prop-types';
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker
} from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';

const geoUrl = '/js/client/admin/components/visitor/maps/world.geojson';

const WorldMap = ({ data = [] }) => {

    const getCountryValue = (name) => {
        const item = data.find(
            (x) =>
                x.name &&
                x.name.toLowerCase() === name.toLowerCase()
        );

        return item ? Number(item.value) : 0;
    };

const getColor = (value) => {
    if (value === 0) return '#dbeafe';
    if (value < 5) return '#93c5fd';
    if (value < 10) return '#60a5fa';
    if (value < 20) return '#3b82f6';
    if (value < 50) return '#2563eb';
    if (value < 100) return '#1d4ed8';

    return '#1e3a8a';
};

    return (
        <div
style={{
    fontFamily: 'Arial',
    fontSize: 20,
    fill: '#111',
    fontWeight: 'bold',
    pointerEvents: 'none',
    paintOrder: 'stroke',
    stroke: '#ffffff',
    strokeWidth: 2
}}
        >
            <ComposableMap
                projectionConfig={{
                    scale: 145
                }}
                width={800}
                height={391}
                style={{
                    width: '100%',
                    height: '100%'
                }}
            >
                <Geographies geography={geoUrl}>
                    {({ geographies }) => (
                        <>
                            {geographies.map((geo) => {
                                const name =
                                    geo.properties.ADMIN ||
                                    geo.properties.NAME ||
                                    geo.properties.name ||
                                    '';

                                const value = getCountryValue(name);

                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill={getColor(value)}
                                        stroke="#ffffff"
                                        strokeWidth={0.5}
                                        style={{
                                            default: {
                                                outline: 'none'
                                            },
                                            hover: {
                                                fill: '#ff9800',
                                                outline: 'none',
                                                cursor: 'pointer'
                                            },
                                            pressed: {
                                                outline: 'none'
                                            }
                                        }}
                                    />
                                );
                            })}

                            {geographies.map((geo) => {
                                const name =
                                    geo.properties.ADMIN ||
                                    geo.properties.NAME ||
                                    geo.properties.name ||
                                    '';

                                if (!name) {
                                    return null;
                                }

                                const centroid = geoCentroid(geo);

                                return (
                                    <Marker
                                        key={`label-${geo.rsmKey}`}
                                        coordinates={centroid}
                                    >
<text
    textAnchor="middle"
    style={{
        fontFamily: 'Arial',
        fontSize: 8,
        fill: '#2563eb',
        fontWeight: 'bold',
        pointerEvents: 'auto',
        cursor: 'pointer',
        paintOrder: 'stroke',
        stroke: '#ffffff',
        strokeWidth: 2,
        transition: 'font-size 0.2s ease'
    }}
    onMouseEnter={(e) => {
        e.currentTarget.style.fontSize = '18px';
    }}
    onMouseLeave={(e) => {
        e.currentTarget.style.fontSize = '8px';
    }}
>
    {name}
</text>
                                    </Marker>
                                );
                            })}
                        </>
                    )}
                </Geographies>
            </ComposableMap>
        </div>
    );
};

WorldMap.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.number
        })
    )
};

export default WorldMap;