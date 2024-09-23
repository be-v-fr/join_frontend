import { HttpHeaders } from "@angular/common/http";

export const environment = {
    AUTH_TOKEN_HEADERS: new HttpHeaders().set('Authorization', 'Token ' + localStorage.getItem('token')),
    BASE_URL: 'http://localhost:8000/api/',
    BADGE_COLORS: [
        '#FDDC2F',
        '#33DA81',
        '#E98366',
        '#C27177',
        '#42F9B9',
        '#2AEC8B',
        '#6DD44A',
        '#C7ACC0',
        '#309CF4',
        '#B663F3',
        '#b579d2',
        '#809283',
        '#58AC47',
        '#2FB287',
        '#2AFDC3',
        '#D2FA60',
        '#A8EE51',
        '#A9DDC7',
        '#FE68C4',
        '#DC3DF5',
        '#05CDD7',
        '#E07D47',
        '#8EA906',
        '#36B3F0',
        '#BF59F2'
    ],
};
