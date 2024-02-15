module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })

    
    Users.associate = (models) =>{
        Users.hasMany(models.Posts, {
            onDelete: "cascade",
        })
        Users.hasMany(models.Likes, {
            onDelete: "cascade",
        })
        Users.hasMany(models.ChatMessages, {
            onDelete: "cascade",
            
        })
        Users.hasMany(models.Chats, {
            onDelete: "cascade",
        })
        Users.hasMany(models.Adds, {
            onDelete: "cascade",
        })
    }
    
    
    return Users;
}