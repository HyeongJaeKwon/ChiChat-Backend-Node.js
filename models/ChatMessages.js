module.exports = (sequelize, DataTypes) => {
    const ChatMessages = sequelize.define("ChatMessages", {
        message: {
            type: DataTypes.STRING(16000),
            allowNull: false,
        },
        timestamp: {
            type: 'TIMESTAMP',
            allowNull: false,
        },
      
        
    })
    
    
    return ChatMessages;
}