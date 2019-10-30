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

        if (this.marker1 && popupText && this.latest){
            var list = '<b>' + 'From: ' + '</b>' + popupText + '<dt>' + '<b>' + 'Lat: ' +
            '</b>' + this.latlngs[0][0].toFixed(4) + '</dt>' + '<dt>' + '<b>' + 'Lon: ' +
            '</b>' + this.latlngs[0][1].toFixed(4) + '</dt>';
            this.marker1.bindPopup(list).openPopup();
        }
        if (this.marker2 && popupText && !this.latest){
            var list = '<b>' + 'To: ' + '</b>' + popupText + '<dt>' + '<b>' + 'Lat: ' +
            '</b>' + this.latlngs[1][0].toFixed(4) + '</dt>' + '<dt>' + '<b>' + 'Lon: ' +
            '</b>' + this.latlngs[1][1].toFixed(4) + '</dt>';
            this.marker2.bindPopup(list).openPopup();
        }
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
            marker: 'start',
            lat: coord.lat,
            lng: coord.lon
        });

        this.setEndMarker({
            marker: 'end',
            lat: coord.lat,
            lng: coord.lon
        });

        this.map.on('click', ({ latlng }) => {
            this.latest = true;
            if (typeof this.marker1 !== 'undefined') this.map.removeLayer(this.marker1);
            if (typeof this.polyline !== 'undefined') this.map.removeLayer(this.polyline);
            this.setStartMarker(latlng, () => {
                var newlatlng = {marker: 'start',
                                 lat: latlng.lat,
                                 lng: latlng.lng}
                this.whenStartMarkerSet(newlatlng);
            });
        });

        this.map.on('contextmenu', ({ latlng }) => {
            this.latest = false;
            if (typeof this.marker2 !== 'undefined') this.map.removeLayer(this.marker2);
            if (typeof this.polyline !== 'undefined') this.map.removeLayer(this.polyline);
            this.setEndMarker(latlng, () => {
                var newlatlng = {marker: 'end',
                                 lat: latlng.lat,
                                 lng: latlng.lng}
                this.whenEndMarkerSet(newlatlng);
            });
        });
    }

    setStartMarker(latlng, callback) {
        var coords = {lat: latlng.lat,
                      lng: latlng.lng,}
        this.marker1 = L.marker(coords).addTo(this.map);

        this.latlngs[0] = [latlng.lat, latlng.lng];
        this.polyline = L.polyline(this.latlngs, {color: 'blue'}).addTo(this.map);
        this.map.fitBounds(this.polyline.getBounds());

        if (typeof callback === 'function') callback();
    }

    setEndMarker(latlng, callback) {
        var coords = {lat: latlng.lat,
                      lng: latlng.lng,}
        this.marker2 = L.marker(coords).addTo(this.map);

        this.latlngs[1] = [latlng.lat, latlng.lng];
        this.polyline = L.polyline(this.latlngs, {color: 'blue'}).addTo(this.map);
        this.map.fitBounds(this.polyline.getBounds());

        if (typeof callback === 'function') callback();
    }

    whenStartMarkerSet({ marker, lat, lng: lon }) {
        this.props.onClick({ marker, lat, lon });
    }

    whenEndMarkerSet({ marker, lat, lng: lon }) {
        this.props.onClick({ marker, lat, lon });
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