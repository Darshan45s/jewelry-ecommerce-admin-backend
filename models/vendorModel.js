module.exports = (sequelize, DataTypes) => {
    const Vendor = sequelize.define("Vendor", {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      vendorType: {
        type: DataTypes.ENUM('natural diamond', 'lab grown diamond'),
        allowNull: false
      },
      verificationCode: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true 
    },
      operatingFrom: {
        type: DataTypes.STRING,
        allowNull: true
      },
      contactNumber: {
        type: DataTypes.STRING,
        allowNull: false
      },
      reportingPersonName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      availabilityHours: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      document: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profileCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      kycStatus: {
        type: DataTypes.ENUM('accept', 'reject', 'pending'),
        defaultValue: 'pending'
      },
    });
  
    return Vendor;
  };
  