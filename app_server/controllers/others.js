// app_server/controllers/others.js

// GET login page
exports.login = (req, res) => {
  const flashErrors = req.flash('error');
  const error = flashErrors.length ? flashErrors[0] : null;

  res.render('login', {
    title: 'Login',
    error,
    success: null
  });
};

// GET register page
exports.register = (req, res) => {
  res.render('register', {
    title: 'Register',
    error: null,
    formData: {}
  });
};

// About page (if you use it)
exports.about = (req, res) => {
  res.render('generic-text', { title: 'About' });
};
