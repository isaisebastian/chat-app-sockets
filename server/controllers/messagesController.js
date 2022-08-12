const messageModel = require("../model/messageModel");

module.exports.addMessage = async(req, resp, next) => {
    try{
        const { from, to, message } = req.body;
        const data = await messageModel.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        });
        if(data){
            return resp.json({ msg: "Message added!"});
        } else {
            return resp.json({ msg: "Failed to add message to DB."});
        }
    }catch(err){
        next(err);
    }
};

module.exports.getAllMessages = async(req, resp, next) => {
    try{
        const { from, to } = req.body;
        const messages = await messageModel.find({
            users: {
                $all : [from, to],
            }
        }).sort({updatedAt: 1});
        const projectMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            };
        });
        resp.json(projectMessages);
    }catch(err){
        next(err);
    }
};