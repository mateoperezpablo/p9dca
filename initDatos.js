var knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: "./database.db"
    },
    useNullAsDefault: true
});

knex.insert({nombre: "Pablo", apellidos: "Mateo Pérez", nick: "Noisy", password: "123456789"}).into('usuarios').then();
knex.insert({nombre: "Prueba1", apellidos: "Prueba1", nick: "Prueba1", password: "Prueba1"}).into('usuarios').then();
knex.insert({nombre: "Prueba2", apellidos: "Prueba2 Prueba2", nick: "Prueba2", password: "Prueba2"}).into('usuarios').then();

knex('categorias').insert({nombre: "Ratones", descripcion: "descripcion sencilla"}).then();
knex('categorias').insert({nombre: "Teclados", descripcion: "descripcion sencilla"}).then();
knex('categorias').insert({nombre: "Pantallas", descripcion: "descripcion sencilla"}).then();

knex('productos').insert({nombre: "Raton LG", descripcion: "descripcion", precio: 10.05, categoria_id: 1}).then();
knex('productos').insert({nombre: "Raton Razer", descripcion: "descripcion", precio: 12.55, categoria_id: 1}).then();
knex('productos').insert({nombre: "Teclado LG", descripcion: "descripcion", precio: 7.05, categoria_id: 2}).then();
knex('productos').insert({nombre: "Pantalla TTL", descripcion: "descripcion", precio: 120.18, categoria_id: 3}).then();
knex('productos').insert({nombre: "Raton TTL", descripcion: "descripcion", precio: 10.05, categoria_id: 1}).then();
knex('productos').insert({nombre: "Raton KYS", descripcion: "descripcion", precio: 12.55, categoria_id: 1}).then();
knex('productos').insert({nombre: "Teclado Ninja", descripcion: "descripcion", precio: 7.05, categoria_id: 2}).then();
knex('productos').insert({nombre: "Pantalla Samsung", descripcion: "descripcion", precio: 120.18, categoria_id: 3}).then();
knex('productos').insert({nombre: "Raton Samsung", descripcion: "descripcion", precio: 10.05, categoria_id: 1}).then();
knex('productos').insert({nombre: "Raton Rivals", descripcion: "descripcion", precio: 12.55, categoria_id: 1}).then();
knex('productos').insert({nombre: "Teclado Sony", descripcion: "descripcion", precio: 7.05, categoria_id: 2}).then();
knex('productos').insert({nombre: "Pantalla Sony", descripcion: "descripcion", precio: 120.18, categoria_id: 3}).then();

knex('pedidos').insert({usuario_id: 1}).then();
knex('pedidos').insert({usuario_id: 1}).then();
knex('pedidos').insert({usuario_id: 1}).then();
knex('pedidos').insert({usuario_id: 2}).then();

knex('linpedidos').insert({cantidad: 2, pedidos_id: 1, productos_id: 1}).then();
knex('linpedidos').insert({cantidad: 1, pedidos_id: 1, productos_id: 2}).then();
knex('linpedidos').insert({cantidad: 1, pedidos_id: 1, productos_id: 3}).then();
knex('linpedidos').insert({cantidad: 3, pedidos_id: 1, productos_id: 4}).then();

knex('packs').insert({nombre:'Pack total', precio: 18.95}).then();
knex('packs').insert({nombre:'Pack 2', precio: 18.95}).then();

knex('prodtopacks').insert({packs_id: 1, productos_id: 1}).then();
knex('prodtopacks').insert({packs_id: 1, productos_id: 3}).then();
knex('prodtopacks').insert({packs_id: 1, productos_id: 4}).then();



