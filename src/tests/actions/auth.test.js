
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom';
import { startChecking, startLogin, startRegister } from '../../actions/auth';
import { types } from '../../types/types';
import Swal from 'sweetalert2';
import * as fetchModule from '../../helpers/fetch'



jest.mock('sweetalert2', ()=>({
    fire: jest.fn()
}))

const middlewares = [ thunk ];
const mockStore = configureStore(middlewares);

const initState = {};

let store = mockStore(initState);

Storage.prototype.setItem = jest.fn();

let token = '';

describe('Pruebas en acciones auth.js', () => {
    
    beforeEach(()=>{
        store = mockStore(initState);
        jest.clearAllMocks();
    });

    test('startLoginCorrecto', async() => {
        
        await store.dispatch( startLogin ('gcruzr@gmail.com','123456'));

        const actions = store.getActions();
        //console.log(actions);
        expect( actions[0]).toEqual({
            type: types.authLogin,
            payload: {
                uid: expect.any(String),
                name: expect.any(String)
            }
        })

        

        expect(localStorage.setItem).toHaveBeenCalledWith('token', expect.any(String));
        expect(localStorage.setItem).toHaveBeenCalledWith('token-init-date', expect.any(Number));

        token = localStorage.setItem.mock.calls[0][1];
        //console.log(localStorage.setItem.mock.calls[0][1])

    })
    

    test('startLogin incorrecto', async () => {
        await store.dispatch( startLogin ('gcruzr@gmail.com','12345678'));

        let actions = store.getActions();

        //console.log(actions);

        expect(actions).toEqual([]);

        expect (Swal.fire).toHaveBeenCalledWith("Error", "Password incorrecto", "error");

        await store.dispatch( startLogin ('gcruzr@gmails.com','123456'));

        actions = store.getActions();

        expect(actions).toEqual([]);

        expect (Swal.fire).toHaveBeenCalledWith("Error", "El usuario no existe con ese correo", "error");

    })
    

    test('startRegister correcto', async () => {
        
        fetchModule.fetchSinToken = jest.fn(()=>({
            json(){
                return{
                    ok: true,
                    uid: '1234',
                    name: 'Carlos',
                    token:'ABC123ABC123'

                }
            }
        }));

        await store.dispatch( startRegister ('test@gmail.com','123456', 'test'));

        const actions = store.getActions();

        expect(actions[0]).toEqual({
            type: types.authLogin,
            payload:{
                uid:'1234',
                name: 'Carlos',
            }
        })

        //console.log(actions);
        expect(localStorage.setItem).toHaveBeenCalledWith('token', expect.any(String));
        expect(localStorage.setItem).toHaveBeenCalledWith('token-init-date', expect.any(Number));
    })

    test('startChecking correcto', async () => {

        fetchModule.fetchConToken = jest.fn(()=>({
            json(){
                return{
                    ok: true,
                    uid: '1234',
                    name: 'Carlos',
                    token:'ABC123ABC123'

                }
            }
        }));

        await store.dispatch( startChecking ());

        const actions = store.getActions();

        localStorage.setItem('token', token);

        //console.log(token);
        //console.log(actions);

        expect( actions[0]).toEqual({
            type:types.authLogin,
            payload:{
                uid: '1234',
                name: 'Carlos'
            }
        });

        expect (localStorage.setItem).toHaveBeenCalledWith('token','ABC123ABC123');
        
    })
    
    
})
