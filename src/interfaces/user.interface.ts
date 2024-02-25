export default interface UserInterface {
    name: string;
    lastname: string;
    username: string;
    password: string;
    email: string;
    verifyPassword: (password: string) => Promise<boolean>;
}
