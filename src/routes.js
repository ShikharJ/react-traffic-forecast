import { lazy } from "react";

import MapIcon from '../assets/map.png';

const Main = lazy(() => import('./pages/main/MainPage.jsx'));
const Map = lazy(() => import('./pages/map/MapPage.jsx'));

const routes = [
    {
        path: '/',
        title: 'Main',
        exact: true,
        component: Main,
        fullSize: true,
        center: true
    },
    {
        path: '/map',
        title: 'Map',
        exact: false,
        toMenu: true,
        img: MapIcon,
        component: Map
    }
];

export default routes;