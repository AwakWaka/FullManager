import * as SQLite from 'expo-sqlite';

// Abrir/criar o banco de dados
const db = SQLite.openDatabase('myDatabase.db');

// Função para criar as tabelas necessárias
const createTables = () => {
  db.transaction((tx) => {
    // Tabela de vendas
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS vendas (id INTEGER PRIMARY KEY AUTOINCREMENT, cliente TEXT, quantidade INTEGER, valor REAL, data DATE);'
    );
    // Tabela de finanças
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS financas (id INTEGER PRIMARY KEY AUTOINCREMENT, data DATE, lucro REAL);'
    );
    // Tabela de tarefas
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS tarefas (id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT, prazo DATE, status TEXT);'
    );
  }, 
  (error) => {
    console.error('Erro ao criar tabelas:', error);
  },
  () => {
    console.log('Tabelas criadas ou já existem.');
  });
};

// Função para inserir venda
const insertVenda = (cliente, quantidade, valor) => {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO vendas (cliente, quantidade, valor, data) VALUES (?, ?, ?, ?);',
      [cliente, quantidade, valor, new Date().toISOString()],
      () => console.log('Venda inserida com sucesso!'),
      (error) => console.error('Erro ao inserir venda:', error)
    );
  });
};

// Função para inserir finanças (lucro)
const insertFinanca = (lucro) => {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO financas (data, lucro) VALUES (?, ?);',
      [new Date().toISOString(), lucro],
      () => console.log('Finança registrada com sucesso!'),
      (error) => console.error('Erro ao registrar finança:', error)
    );
  });
};

// Função para inserir tarefa
const insertTarefa = (descricao, prazo, status) => {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO tarefas (descricao, prazo, status) VALUES (?, ?, ?);',
      [descricao, prazo, status],
      () => console.log('Tarefa inserida com sucesso!'),
      (error) => console.error('Erro ao inserir tarefa:', error)
    );
  });
};

// Função para consultar vendas
const getVendas = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM vendas;',
      [],
      (_, results) => {
        const vendas = [];
        for (let i = 0; i < results.rows.length; i++) {
          vendas.push(results.rows.item(i));
        }
        callback(vendas);
      },
      (error) => console.error('Erro ao consultar vendas:', error)
    );
  });
};

// Função para consultar finanças
const getFinancas = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM financas;',
      [],
      (_, results) => {
        const financas = [];
        for (let i = 0; i < results.rows.length; i++) {
          financas.push(results.rows.item(i));
        }
        callback(financas);
      },
      (error) => console.error('Erro ao consultar finanças:', error)
    );
  });
};

// Função para consultar tarefas
const getTarefas = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM tarefas;',
      [],
      (_, results) => {
        const tarefas = [];
        for (let i = 0; i < results.rows.length; i++) {
          tarefas.push(results.rows.item(i));
        }
        callback(tarefas);
      },
      (error) => console.error('Erro ao consultar tarefas:', error)
    );
  });
};

export { createTables, insertVenda, insertFinanca, insertTarefa, getVendas, getFinancas, getTarefas };