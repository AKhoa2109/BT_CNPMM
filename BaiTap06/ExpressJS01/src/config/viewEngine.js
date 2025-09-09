import express from "express"; //cú pháp khác tương đương: var express = require('express');
import path from "path";
//javascript theo ES6

let configViewEngine = (app) => {
    app.use(express.static(path.join('./src','public'))); //Thiết lập thư mục tĩnh chứa images, css,...
    app.set("views", path.join('./src','views')); //thư mục chứa views
    app.set("view engine", "ejs"); //thiết lập viewEngine
};

export default configViewEngine; //xuất hàm ra