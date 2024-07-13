import express, { Request, Response, NextFunction, response } from "express";
import cors from "cors";
import fs from "fs";
const serverless = require('serverless-http');

// Start up the Rest API
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// local setup
// const port = 8080;
// app.listen(port, () => console.log(`App is running on port ${port}`));// 4
// app.get("/", (req: Request, res: Response, next: NextFunction) =>
//   res.status(200).json({ message: "api is live" })
// );

// lambda hosting
module.exports.handler = serverless(app)

// HTTP METHODS
// Get: get all names
app.get("/names", async (req: Request, res: Response) => {
    // try and catch the error from loadNames
    try {
        const names = loadNames().names;
        // if names are not loaded properly, return 404 not found
        if (!names) {
            return res.status(404).json({error: "No names loaded from the json file.."})
        }
        // return 200 ok
        return res.status(200).json(names)
    }catch(error){
        // 500 internal server error
        return res.status(500).json({error})
    }
})

// Post: search name by given input
app.post("/search", (req: Request, res: Response) => {
    // read the search key word from request body e.g. {"input": "Lee"}
    const { input } = req.body
    // validate request
    if (!input){
        // 400 Bad Request
        return res.status(400).send({error: "Bad Request: Invalid input request"})
    }
    try {
        // get all names
        const names = loadNames().names;
        // if names are not loaded properly, return 404 not found
        if (!names) {
            return res.status(404).json({error: "No names loaded from the json file.."})
        }

        const result = searchName(names, input)
        return res.status(200).json({result})
    }catch(error){
        // 500 internal server error
        return res.status(500).json({error})
    }

})


// FUNCTIONS
// load names from json
function loadNames() {
    // try and catch the error during reading the json file
    try {
        // console.log(__dirname + "/names.json")
        const data = fs.readFileSync(__dirname + "/names.json", "utf8")
        // console.log(data)
        return JSON.parse(data)
    }catch(error){
        console.log({error})
        return {}
    }
}

// check if a character is chinese
function isChinese(char: string): boolean{
    return new RegExp(/\p{Script=Han}/u).test(char)
}

// Step 1: split name by western and chinese name
function splitName(name: string): string[] {
    let resultList: string[] = []
    // split by spaces e.g. {"Annie Lee 安妮李"} => ["Annie", "Lee", "安妮李"]
    const nameList = name.split(/\s+/)
    nameList.forEach(char => {
        if (isChinese(char)){
            resultList = resultList.concat(char.split(""))
        }else{
            resultList.push(char.toLowerCase())
        }
    })
    return resultList
}

// search name based on input
function searchName(names: string[], input: string): string {
    try {
        // solution:
        // 1. split the western name and chinese name by utilizing regrex expression
        //    e.g. {"Annie Lee 安妮李"} => ["Annie", "Lee", "安", "妮", "李"]
        // 2. loop through the names and split them by step 1
        // 3. split the input name. e.g. "Annie Lee" => ["Annie", "Lee"] or "李安妮" => ["李", "安", "妮"]
        // 4. compare input list to name list
        let result = ""
        const inputCharList = splitName(input)
        // console.log("input list: " + inputCharList)
        // Step 2
        names.forEach(name => {
            const nameList = splitName(name)
            // console.log(nameList)
            // Step 3
            if (inputCharList.every(item => nameList.includes(item))){
                result = name
            }
        })
        return result
    }catch(error){
        console.log({error})
        // throw error to calling function
        throw error
    }
}