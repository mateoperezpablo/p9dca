var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./database.db"
    },
    useNullAsDefault: true
});

//TABLA USUARIOS
knex.schema.hasTable('usuarios').then(function (exists) {
    if (!exists) {
        return knex.schema.createTable('usuarios', function (table) {
            table.increments();
            table.string('nombre');
            table.string('apellidos');
            table.string('nick');
            table.string('password');
        });
    }
});

//TABLA CATEGORIAS
knex.schema.hasTable('categorias').then(function (exists) {
    if (!exists) {
        return knex.schema.createTable('categorias', function (table) {
            table.increments();
            table.string('nombre');
            table.string('descripcion');
        });
    }
});

//TABLA PRODUCTOS
knex.schema.hasTable('productos').then(function (exists) {
    if (!exists) {
        return knex.schema.createTable('productos', function (table) {
            table.increments();
            table.string('nombre');
            table.string('descripcion');
            table.float('precio');
            table.integer('categoria_id').unsigned()
            table.foreign('categoria_id').references('categorias.id');
        });
    }
});

//TABLA PEDIDOS
knex.schema.hasTable('pedidos').then(function (exists) {
    if (!exists) {
        return knex.schema.createTable('pedidos', function (table) {
            table.increments();
            table.integer('usuario_id').unsigned()
            table.foreign('usuario_id').references('usuarios.id');
        });
    }
});

//TABLA LINPEDIDOS
knex.schema.hasTable('linpedidos').then(function (exists) {
    if (!exists) {
        return knex.schema.createTable('linpedidos', function (table) {
            table.increments();
            table.integer('cantidad');
            table.integer('pedidos_id').unsigned()
            table.foreign('pedidos_id').references('pedidos.id');
            table.integer('productos_id').unsigned()
            table.foreign('productos_id').references('productos.id');
        });
    }
});

//TABLA PACK
knex.schema.hasTable('packs').then(function (exists) {
    if (!exists) {
        return knex.schema.createTable('packs', function (table) {
            table.increments();
            table.string('nombre');
            table.float('precio');
        });
    }
});

//RELACION PRODUCTOS Y PACKS
knex.schema.hasTable('prodtopacks').then(function (exists) {
    if (!exists) {
        return knex.schema.createTable('prodtopacks', function (table) {
            table.increments();
            table.integer('packs_id').references('packs.id');
            table.integer('productos_id').references('productos.id');
        });
    }
});

