const request = require('request');

// Build API base URL correctly for BOTH local and Render
// - Locally: PORT is undefined → uses 3000
// - On Render: PORT is provided by Render environment variable 
const port = process.env.PORT || 3000;
const apiOptions = {
  server: process.env.API_SERVER || `http://localhost:${port}`
};

/* GET login page */
exports.login = (req, res) => {
  res.render('login', { title: 'Login' });
};

/* POST login */
exports.doLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('login', {
      title: 'Login',
      error: 'All fields required.'
    });
  }

  const path = '/api/users/login';
  const requestOptions = {
    url: apiOptions.server + path,
    method: 'POST',
    json: { email, password }
  };

  request(requestOptions, (err, response, body) => {
    // Defensive check
    if (err || !response) {
      console.error('Error calling /api/users/login:', err);
      return res.render('login', {
        title: 'Login',
        error: 'Login service is unavailable. Please try again.'
      });
    }

    if (response.statusCode === 200 && body && body.user) {
      // Save user info in session
      req.session.user = {
        id: body.user._id,
        firstName: body.user.firstName,
        lastName: body.user.lastName,
        email: body.user.email
      };
      return res.redirect('/');
    }

    if (response.statusCode === 401 || response.statusCode === 400) {
      return res.render('login', {
        title: 'Login',
        error: 'Invalid email or password.'
      });
    }

    // Any other unexpected status
    console.error(
      'Unexpected status from /api/users/login:',
      response.statusCode,
      body
    );
    return res.render('login', {
      title: 'Login',
      error: 'There was a problem logging in. Please try again.'
    });
  });
};

exports.logout = (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.log('Error destroying session:', err);
      }
      res.redirect('/login');
    });
  } else {
    res.redirect('/login');
  }
};

/* GET register page */
exports.register = (req, res) => {
  res.render('register', { title: 'Register' });
};

/* POST register */
exports.doRegister = (req, res) => {
  const { firstName, lastName, email, phoneNo, address, password, confirm } = req.body;

  const formData = { firstName, lastName, email, phoneNo, address };

  // Validation
  if (!firstName || !lastName || !email || !phoneNo || !address || !password || !confirm) {
    return res.render('register', {
      title: 'Register',
      error: 'All fields are required.',
      formData
    });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.render('register', {
      title: 'Register',
      error: 'Please enter a valid email address.',
      formData
    });
  }

  if (password.length < 8) {
    return res.render('register', {
      title: 'Register',
      error: 'Password must be at least 8 characters long.',
      formData
    });
  }

  if (password !== confirm) {
    return res.render('register', {
      title: 'Register',
      error: 'Passwords do not match.',
      formData
    });
  }

  const path = '/api/users';
  const requestOptions = {
    url: apiOptions.server + path,
    method: 'POST',
    json: { firstName, lastName, email, phoneNo, address, password }
  };

  request(requestOptions, (err, response, body) => {
    // Defensive check again
    if (err || !response) {
      console.error('Error calling /api/users:', err);
      return res.render('register', {
        title: 'Register',
        error: 'Registration service is unavailable. Please try again.',
        formData
      });
    }

    if (response.statusCode === 201) {
      return res.redirect('/login');
    }

    if (response.statusCode === 409) {
      return res.render('register', {
        title: 'Register',
        error: 'Email already registered.',
        formData
      });
    }

    console.error(
      'Unexpected status from /api/users:',
      response.statusCode,
      body
    );
    return res.render('register', {
      title: 'Register',
      error: 'Error creating account. Please try again.',
      formData
    });
  });
};

/* About page */
exports.about = (req, res) => {
  res.render('generic-text', { title: 'About' });
};
