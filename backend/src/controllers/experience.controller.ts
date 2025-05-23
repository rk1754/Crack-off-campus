import { Request, Response } from "express";
import Experience from "../models/experience.model";

class ExperienceController {
    addExperience = async(req : Request, res : Response):Promise<void> =>{
        try{
            const {job_title, start_date, end_date, company_name, location, description, employment_type} = req.body;
            if(!job_title || !start_date || !end_date || !company_name || !location || !employment_type){
                res.status(400).json({
                    success : false,
                    message : "Please provide all details"
                });
                return;
            }
            const user = req.user;
            if(!user){
                res.status(403).json({
                    success : false,
                    message : "Please login first"
                });
                return;
            }
            const experience = await Experience.create({
                job_title,
                start_date,
                user_id : user.id,
                end_date,
                company_name,
                location,
                description,
                employment_type
            });

            if(!experience){
                res.status(500).json({
                    success : false,
                    message : "Failed to add experience"
                });
                return;
            }

            res.status(201).json({
                success : true,
                experience
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

    findExperienceByUser = async(req :Request, res : Response):Promise<void>=>{
        try{
            const user = req.user;
            if(!user){
                res.status(403).json({
                    success : false,
                    message : "Please login first"
                });
                return;
            }

            const experience = await Experience.findAll({
                where : {
                    user_id : user.id
                }
            });
            if(!experience){
                res.status(404).json({
                    success : false,
                    message : "Experience not found"
                });
                return;
            }

            res.status(200).json({
                success : true,
                experience
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

    findExperienceById = async(req : Request, res : Response):Promise<void>=>{
        try{
            const id = req.params.id;
            if(!id){
                res.status(400).json({
                    success : false,
                    message : "Please provide ID"
                });
                return;
            }

            const experience = await Experience.findByPk(id);
            if(!experience){
                res.status(404).json({
                    success : false,
                    message : "Experience not found"
                });
                return;
            }

            res.status(200).json({
                success : true,
                experience
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

    updateExperience = async(req : Request, res : Response):Promise<void>=>{
        try{
            const id = req.params.id;
            const data = req.body;
            if(!id){
                res.status(400).json({
                    success : false,
                    message : "Please provide id to update experience"
                });
                return;
            }

            await Experience.update(data,{
                where : {
                    id : id
                }
            });

            res.status(200).json({
                success : true,
                message : "Experience updated successfully"
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

    deleteExperience = async(req : Request, res : Response):Promise<void>=>{
        try{
            const id = req.params.id;
            if(!id){
                res.status(400).json({
                    success : false,
                    message : "Please provide ID"
                });
                return;
            }

            await Experience.destroy({
                where : {
                    id
                }
            });

            res.status(200).json({
                success : true,
                message : "Experience deleted successfully"
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

export default ExperienceController;