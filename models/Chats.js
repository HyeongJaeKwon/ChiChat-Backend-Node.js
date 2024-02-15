module.exports = (sequelize, DataTypes) => {
    const Chats = sequelize.define("Chats", {
        timestamp: {
            type: 'TIMESTAMP',
            allowNull: false,
        },
    })
    
    Chats.associate = (models) =>{
        Chats.hasMany(models.ChatMessages, {
            onDelete: "cascade",
        })
      
    }
    
    return Chats;
}