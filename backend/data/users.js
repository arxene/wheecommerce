import bcrypt from "bcryptjs";

const users = [
    {
        name: "Harry Houdini",
        email: "harry.houdini@wheecommerce.com",
        password: bcrypt.hashSync("123456"),
        isAdmin: false,
    },
    {
        name: "Admin User",
        email: "admin@wheecommerce.com",
        password: bcrypt.hashSync("123456"),
        isAdmin: true,
    },
    {
        name: "Jane Says",
        email: "jane.says@wheecommerce.com",
        password: bcrypt.hashSync("123456"),
        isAdmin: false,
    },
];

export default users;
