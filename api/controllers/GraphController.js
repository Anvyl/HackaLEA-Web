module.exports = {
    showGraph: function(req, res){
        var username = req.param('userName');
        if(!username){
            return res.badRequest();
        }

        
    }   
}