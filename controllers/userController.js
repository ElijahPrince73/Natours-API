exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "DELETED",
    },
  });
};

exports.createUser = (req, res) => {
  res.status(500);
};

exports.getUser = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "DELETED",
    },
  });
};

exports.updateUser = (req, res) => {
  res.status(500);
};

exports.deleteUser = (req, res) => {
  res.status(500);
};
