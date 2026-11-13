
-- ==========================================
-- BANCO DE DADOS: VISTORIA DE CAMINHÕES
-- ==========================================

CREATE DATABASE IF NOT EXISTS vistoriacaminhao;
USE vistoriacaminhao;

-- ==========================================
-- TABELA: USUARIO
-- ==========================================

CREATE TABLE IF NOT EXISTS Usuario (
    ID_usuario INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    Senha VARCHAR(255) NOT NULL,
    Tipo_Usuario VARCHAR(30) NOT NULL,
    Ativo BOOLEAN DEFAULT TRUE,
    Data_Adesao DATE,
    Num_Vistorias INT DEFAULT 0,
    Num_Ocorrencias INT DEFAULT 0
);

-- ==========================================
-- TABELA: CAMINHAO
-- ==========================================

CREATE TABLE IF NOT EXISTS Caminhao (
    Placa VARCHAR(10) PRIMARY KEY,
    Modelo VARCHAR(100) NOT NULL,
    Marca VARCHAR(100) NOT NULL,
    Ano DATE,
    Capacidade DOUBLE,
    Peso DOUBLE,
    Num_Eixos INT
);

-- ==========================================
-- TABELA: VISTORIA
-- ==========================================

CREATE TABLE IF NOT EXISTS Vistoria (
    Cod_Vistoria INT AUTO_INCREMENT PRIMARY KEY,
    Data_Abertura DATE NOT NULL,
    Data_Fechamento DATE,
    Data_Prevista DATE,
    Horario_Previsto TIME,
    Descricao TEXT,
    Status BOOLEAN DEFAULT FALSE,
    ID_Analista INT NOT NULL,
    ID_Operador INT NULL,
    Placa VARCHAR(10) NOT NULL,

    FOREIGN KEY (ID_Analista)
        REFERENCES Usuario(ID_usuario),

    FOREIGN KEY (ID_Operador)
        REFERENCES Usuario(ID_usuario),

    FOREIGN KEY (Placa)
        REFERENCES Caminhao(Placa)
);

-- ==========================================
-- TABELA: OCORRENCIA
-- ==========================================

CREATE TABLE IF NOT EXISTS Ocorrencia (
    Cod_Ocorrencia INT AUTO_INCREMENT PRIMARY KEY,
    Cod_Vistoria INT NOT NULL,
    Titulo VARCHAR(150) NOT NULL,
    Descricao TEXT,
    Data_Ocorrencia DATE NOT NULL,
    Gravidade VARCHAR(30),

    FOREIGN KEY (Cod_Vistoria)
        REFERENCES Vistoria(Cod_Vistoria)
);

-- ==========================================
-- TABELA: ITEM_VISTORIA
-- ==========================================

CREATE TABLE IF NOT EXISTS Item_Vistoria (
    ID_Item INT AUTO_INCREMENT PRIMARY KEY,
    COD_Vistoria INT NOT NULL,
    Observacao TEXT,
    Situacao VARCHAR(50),

    FOREIGN KEY (COD_Vistoria)
        REFERENCES Vistoria(Cod_Vistoria)
);

-- ==========================================
-- TABELA: FOTO
-- ==========================================

CREATE TABLE IF NOT EXISTS Foto (
    ID_Foto INT AUTO_INCREMENT PRIMARY KEY,
    Cod_Vistoria INT NOT NULL,
    Link_Foto VARCHAR(500) NOT NULL,
    Descricao TEXT,

    FOREIGN KEY (Cod_Vistoria)
        REFERENCES Vistoria(Cod_Vistoria)
);
