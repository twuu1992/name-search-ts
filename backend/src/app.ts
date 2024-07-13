import express, { Request, Response, NextFunction, response } from "express";
import cors from "cors";
import fs from "fs";

// Start up the Rest API
const app = express();
const port = 8080;
app.use(cors());
app.listen(port, () => console.log(`App is running on port ${port}`));// 4
app.get("/", (req: Request, res: Response, next: NextFunction) =>
  res.status(200).json({ message: "api is live" })
);

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
