import React, { PureComponent } from 'react';
import L from 'leaflet';
import styled from '@emotion/styled';

import 'leaflet/dist/leaflet.css';
import marker from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: marker2x,
    iconUrl: marker,
    shadowUrl: markerShadow
});

const MapWrapper = styled('div')`
  flex: 1;
`;

class Map extends PureComponent {
    constructor(props) {
        super(props);

        this.map = null;
        this.latest = true;
        this.marker1 = null;
        this.marker2 = null;
        this.latlngs = [];
        this.polyline = null;
        this.tileLayerUrl = 'https://{s}.tile.osm.org/{z}/{x}/{y}.png';
    }

    componentDidMount() {
        this.build();
    }

    componentDidUpdate() {
        const { popupText } = this.props;

        if (this.marker1 && popupText && this.latest) this.marker1.bindPopup(popupText).openPopup();
        if (this.marker2 && popupText && !this.latest) this.marker2.bindPopup(popupText).openPopup();
    }

    componentWillUnmount() {
        this.destroy();
    }

    build() {
        const { coord } = this.props;

        this.map = L.map('map');
        L.tileLayer(this.tileLayerUrl, {
            attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 15
        }).addTo(this.map);

        this.latlngs = [[coord.lat, coord.lon],
                        [coord.lat, coord.lon]];
        this.polyline = L.polyline(this.latlngs, {color: 'red'}).addTo(this.map);
        this.map.fitBounds(this.polyline.getBounds());

        this.setStartMarker({
            lat: coord.lat,
            lng: coord.lon
        });

        this.setEndMarker({
            lat: coord.lat,
            lng: coord.lon
        });

        this.map.on('click', ({ latlng }) => {
            this.latest = true;
            if (typeof this.marker1 !== 'undefined') this.map.removeLayer(this.marker1);
            if (typeof this.polyline !== 'undefined') this.map.removeLayer(this.polyline);
            this.setStartMarker(latlng, () => {
                this.whenStartMarkerSet(latlng);
            });
        });

        this.map.on('contextmenu', ({ latlng }) => {
            this.latest = false;
            if (typeof this.marker2 !== 'undefined') this.map.removeLayer(this.marker2);
            if (typeof this.polyline !== 'undefined') this.map.removeLayer(this.polyline);
            this.setEndMarker(latlng, () => {
                this.whenEndMarkerSet(latlng);
            });
        });
    }

    setStartMarker(latlng, callback) {
        this.marker1 = L.marker(latlng).addTo(this.map);

        this.latlngs[0] = [latlng.lat, latlng.lng];
        this.polyline = L.polyline(this.latlngs, {color: 'blue'}).addTo(this.map);
        this.map.fitBounds(this.polyline.getBounds());

        if (typeof callback === 'function') callback();
    }

    setEndMarker(latlng, callback) {
        this.marker2 = L.marker(latlng).addTo(this.map);

        this.latlngs[1] = [latlng.lat, latlng.lng];
        this.polyline = L.polyline(this.latlngs, {color: 'blue'}).addTo(this.map);
        this.map.fitBounds(this.polyline.getBounds());

        if (typeof callback === 'function') callback();
    }

    whenStartMarkerSet({ lat, lng: lon }) {
        this.props.onClick({ lat, lon });
    }

    whenEndMarkerSet({ lat, lng: lon }) {
        this.props.onClick({ lat, lon });
    }

    destroy() {
        this.map.remove();
    }

    render() {
        return (
            <MapWrapper id="map" />
        );
    }
}

export default Map;