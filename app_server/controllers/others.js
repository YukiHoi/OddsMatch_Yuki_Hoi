const request = require('request');

// This tells our app where to find the API
const apiOptions = { 
  server : 'http://localhost:3000'  // This means "on computer, port 3000"
}; 

/* GET login page */
exports.login = (req, res) => {
  res.render('login', { title: 'Login' });
};

/* POST login */
exports.doLogin = (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    res.render('login', { title: 'Login', error: 'All fields required.' });
    return;
  }

  const path = '/api/users/login';
  const requestOptions = {
    url: apiOptions.server + path,
    method: 'POST',
    json: { email, password }
  };

  request(
    requestOptions,
    (err, response, body) => {
      if (response.statusCode === 200) {
        // Save user info in session
        req.session.user = {
          id: body.user._id,
          firstName: body.user.firstName,
          lastName: body.user.lastName,
          email: body.user.email
        };
        res.redirect('/');
      } else {
        res.render('login', { 
          title: 'Login', 
          error: 'Invalid email or password.'
        });
      }
    }
  );
};
exports.logout = (req, res) => {
  if (req.session) {
    // delete session object
    req.session.destroy((err) => {
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
  let { firstName, lastName, email, phoneNo, address, password, confirm } = req.body;

  // Keep the form data to send back if there's an error
  const formData = { firstName, lastName, email, phoneNo, address };

  // Check if any field is empty
  if (!firstName || !lastName || !email || !phoneNo || !address || !password || !confirm) {
    res.render('register', { 
      title: 'Register', 
      error: 'All fields are required.', 
      formData 
    });
    return;
  }

  // Check email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    res.render('register', { 
      title: 'Register', 
      error: 'Please enter a valid email address.', 
      formData 
    });
    return;
  }

  // Check password requirements
  if (password.length < 8) {
    res.render('register', { 
      title: 'Register', 
      error: 'Password must be at least 8 characters long.', 
      formData 
    });
    return;
  }

  // Check if passwords match
  if (password !== confirm) {
    res.render('register', { 
      title: 'Register', 
      error: 'Passwords do not match.', 
      formData 
    });
    return;
  }

  const path = '/api/users';
  const requestOptions = {
    url: apiOptions.server + path,
    method: 'POST',
    json: { firstName, lastName, email, phoneNo, address, password }
  };

  request(
    requestOptions,
    (err, response, body) => {
      if (response.statusCode === 201) {
        res.redirect('/login');
      } else if (response.statusCode === 409) {
        res.render('register', { 
          title: 'Register', 
          error: 'Email already registered.',
          formData: { firstName, lastName, email, phoneNo, address }
        });
      } else {
        res.render('register', { 
          title: 'Register', 
          error: 'Error creating account. Please try again.',
          formData: { firstName, lastName, email, phoneNo, address }
        });
      }
    }
  );
};

/* About page */
exports.about = (req, res) => {
  res.render('generic-text', { title: 'About' });
};