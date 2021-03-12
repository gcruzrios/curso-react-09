import { fetchSinToken, fetchConToken } from "../../helpers/fetch"

describe('Pruebas en Helpers/fetch', () => {

    let token = '';

    test('fetchSinToken debe de funcionar', async () => {

        const resp = await fetchSinToken('auth',{ email:'gcruzr@gmail.com', password: '123456'}, 'POST');
        
        expect ( resp instanceof Response ).toBe(true);

        const body = await resp.json();
        expect (body.ok).toBe (true);

        

        token= body.token;
    })

    test('fetchConToken debe de funcionar', async () => {

        //console.log(token)
        localStorage.setItem('token',token)

        const resp = await fetchConToken('events/6048f278f40fc121e00aec75',{},'DELETE');
        const body = await resp.json();

        expect(body.msg).toBe('Evento no existe por ese id');

        //console.log(body)


    })
    
})
