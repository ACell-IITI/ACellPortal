import { CV_Review_db } from "../Models/CV_review_model";

export const add_cv = async (req, res) => {
    try {
        const { Name, Roll_No, Student_Email, CV_link, Target_Profile } = req.body;

        if (!Student_Email.endsWith("@iiti.ac.in")) {
            return res.status(400).json({ message: "Log in with Institute Email id" });
        }

        const new_cv = new CV_Review_db({
            Name,
            Roll_No,
            Student_Email,
            CV_link,
            Target_Profile
        });

        await new_cv.save();
        res.status(201).json({ message: "CV Submitted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const get_cv = async (req, res) => {
    try {
        const cv_submissions = await CV_Review_db.find().sort({ createdAt: -1 });
        res.json(cv_submissions);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch submissions" });
    }
};