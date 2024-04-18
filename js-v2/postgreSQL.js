let client;                                                 //Variable global

function startClient() {                                    //Conexión con postreSQL
  const { Client } = require('pg');

  client = new Client({
    user: 'master',                                         //Todo esto es lo que tenemos en el docker (si se cambia hay que cambiarlo aqui tambien)
    password: 'pas1234',
    host: 'localhost', 
    database: 'postgresdb',
    port: 5432, 
  });

  client.connect();                                         //Conecta al cliente
}

//-------------------- QUERIES --------------------

function getUserData(targetUsername) {                      //Permite obtener informacion del usuario                   
  if (!client) {
    console.error('Client is not connected.');
    return;
  }

  client.query(
    'SELECT * FROM get_user_info_by_username($1)', [targetUsername],
    (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
      } else {
        const userInfo = result.rows[0];
        console.log('User Info:', userInfo);
      }
    }
  );
}

function delay(ms) {                                        //le da tiempo a los queries de ser realizados
    return new Promise((resolve) => setTimeout(resolve, ms));
  }


async function closeConnection() {                          //Cierra la conexion con el cliente (unicamente cierrelo cuando el usuario ciera la aplicacion)
    await delay(2000);
    client.end();
    }

//-------------------- QUERIES --------------------

startClient();
getUserData('pame123');
getUserData('mari456');
closeConnection();