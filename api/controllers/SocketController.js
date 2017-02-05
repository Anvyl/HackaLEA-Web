module.exports = {
    receiveMessage: function (req, res){
        if(!req.isSocket){
            return res.badRequest();
        }
    }
}