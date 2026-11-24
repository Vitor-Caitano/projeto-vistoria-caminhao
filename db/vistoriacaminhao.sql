

CREATE TABLE IF NOT EXISTS Usuario (
    idUsuario INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(40) DEFAULT NULL,
    senha VARCHAR(40) DEFAULT NULL,
    tipoUsuario ENUM('analista','operador') DEFAULT NULL,
    ativo TINYINT(1) DEFAULT NULL,
    dataAdesao DATE DEFAULT NULL,
    numVistorias INT DEFAULT NULL,
    numOcorrencias INT DEFAULT NULL,
    nome VARCHAR(40) DEFAULT NULL,

    PRIMARY KEY (idUsuario),
    UNIQUE KEY email (email)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS Caminhao (
    Placa VARCHAR(10) PRIMARY KEY,
    Modelo VARCHAR(100) NOT NULL,
    Marca VARCHAR(100) NOT NULL,
    Ano DATE,
    Capacidade DOUBLE,
    Peso DOUBLE,
    Num_Eixos INT
);

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
        REFERENCES Usuario(idUsuario),

    FOREIGN KEY (ID_Operador)
        REFERENCES Usuario(idUsuario),

    FOREIGN KEY (Placa)
        REFERENCES Caminhao(Placa)
);

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

CREATE TABLE IF NOT EXISTS Item_Vistoria (
    ID_Item INT AUTO_INCREMENT PRIMARY KEY,
    COD_Vistoria INT NOT NULL,
    Observacao TEXT,
    Situacao VARCHAR(50),

    FOREIGN KEY (COD_Vistoria)
        REFERENCES Vistoria(Cod_Vistoria)
);

CREATE TABLE IF NOT EXISTS Foto (
    ID_Foto INT AUTO_INCREMENT PRIMARY KEY,
    Cod_Vistoria INT NOT NULL,
    Link_Foto VARCHAR(500) NOT NULL,
    Descricao TEXT,

    FOREIGN KEY (Cod_Vistoria)
        REFERENCES Vistoria(Cod_Vistoria)
);
