import { Request, Response } from "express";
import Education from "../models/education.model";

class EducationController{
    addEducation = async(req : Request, res : Response):Promise<void>=>{
        try{
            const {education, start_year, end_year, specialization} = req.body;
            const user = req.user;
            if(!user){
                res.status(403).json({
                    success : false,
                    message : "Please login first"
                });
                return;
            }

            if(!education || !start_year || !end_year){
                res.status(400).json({
                    success : false,
                    message : "Please provide complete details"
                });
                return;
            }

            const userEducation = await Education.create({
                education,
                start_year,
                end_year,
                specialization,
                user_id : user.id
            });
            if(!userEducation){
                res.status(500).json({
                    success : false,
                    message : "Something went wrong adding your education"
                });
                return;
            }

            res.status(201).json({
                success : true,
                userEducation
            });
            return;
        }catch(err){
            console.error(err);
            res.status(500).json({
                success : false,
                message : "Something went wrong"
            });
            return;
        }
    }

    fetchUserEducation = async(req : Request, res : Response):Promise<void>=>{
        try{
            const user = req.user;
            if(!user){
                res.status(403).json({
                    success : false,
                    message : "Please login first"
                });
                return;
            }

            const userEducation = await Education.findAll({where : {
                user_id : user.id
            }});
            if(!userEducation){
                res.status(400).json({
                    success : false,
                    message : "Education not found"
                });
                return;
            }
            res.status(200).json({
                success : true,
                userEducation
            });
            return;
        }catch(err){
            console.error(err);
            res.status(500).json({
                success : false,
                message : "Something went wrong"
            });
            return;
        }
    }

    updateEducation = async(req : Request, res : Response):Promise<void>=>{
        try{
            const data = req.body;
            const id = req.params.id;
            if(!data){
                res.status(400).json({
                    success : false,
                    message : "Please provide data to update"
                });
                return;
            }

            if(!id){
                res.status(400).json({
                    success : false,
                    message : "Please provide ID"
                });
                return;
            }

            await Education.update(data, {
                where : {
                    id : id
                }
            });

            res.status(200).json({
                success : true,
                message : "Education updated successfully"
            });
            return;
        }catch(err){
            console.error(err);
            res.status(500).json({
                success : false,
                message : "Something went wrong"
            });
            return;
        }
    }

    removeEducation = async(req : Request, res : Response):Promise<void>=>{
        try{
            const id = req.params.id;
            if(!id){
                res.status(400).json({
                    success : false,
                    message : "Please provide id to delete the education"
                });
                return;
            }

            await Education.destroy({where : {
                id
            }});

            res.status(200).json({
                success : true,
                message : "Education removed successfully"
            });
            return;
        }catch(err){
            console.error(err);
            res.status(500).json({
                success : false,
                message : "Something went wrong"
            });
            return;
        }
    }

    findEducationById = async(req : Request, res : Response):Promise<void>=>{
        try{
            const id = req.params.id;
            if(!id){
                res.status(400).json({
                    success : false,
                    message : "Please provide ID"
                });
                return;
            }

            const education = await Education.findByPk(id);
            if(!education){
                res.status(404).json({
                    success : false,
                    message : "Education data not found"
                });
                return;
            }

            res.status(200).json({
                success : true,
                education
            });
            return;

        }catch(err){
            console.error(err);
            res.status(500).json({
                success : false,
                message : "Something went wrong"
            });
            return;
        }
    }
}

export default EducationController;