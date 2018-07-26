import {  InavState } from '../layouts/NavRedux';
import { ILoginState }  from '../views/LoginRedux';

export interface IRootState {
    nav: InavState;
    login: ILoginState;
}