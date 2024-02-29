"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // se importa express
const cors_1 = __importDefault(require("cors")); // se importa cors para que no haya problemas de comunicacion entre otras plataformas
const users_route_1 = __importDefault(require("./routes/users.route"));
const publications_routes_1 = __importDefault(require("./routes/publications.routes"));
const mongo_1 = __importDefault(require("./configs/mongo"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env" });
const secret = process.env.SECRET;
const server = (0, express_1.default)(); // se crea la instacia de express
const port = process.env.PORT; // se declara el puerto por ahora
server.use((0, cors_1.default)()); // se usa cors
server.use(express_1.default.json()); // se usa el middleware para que express pueda entender json
server.use(express_1.default.urlencoded({ extended: true })); // se usa el middleware para que express pueda entender los datos de un formulario
server.use((0, express_session_1.default)({ secret: secret, resave: true, saveUninitialized: true })); // se usa el middleware para que express pueda usar sesiones
server.use(passport_1.default.initialize()); // se inicializa passport
server.use(passport_1.default.session()); // se usa el middleware para que express pueda usar sesiones de passport
server.use("/users", users_route_1.default); // se declaran las rutas para los usuarios
server.use("/publications", publications_routes_1.default); // se declaran las rutas para las publicaciones
try {
    mongo_1.default.on("error", (err) => {
        console.error("Error de conexion a la base de datos:", err);
    });
    mongo_1.default.once("open", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Conexion a la base de datos exitosa");
    }));
}
catch (error) {
    console.log(error);
}
server.listen(port, () => console.log(`Server is running on port ${port}`)); // se levanta el servidor
