exports.install = function() {
	F.route('/*', 'index', ['authorize']);
	F.route('/', view_login, ['unauthorize']);
	F.route('/logoff/', logoff, ['authorize']);

	// Localization
	F.localize('/templates/*.html', ['compress']);

	// File routing
	F.file('/photos/*.jpg', photo);
};

function photo(req, res) {
	var id = req.split[2];
	var path = F.path.public(req.url.substring(1));

	var index = path.lastIndexOf('?');
	if (index !== -1)
		path = path.substring(0, index);

	F.path.exists(path, function(e) {
		if (e)
			res.file(path);
		else
			res.file(F.path.public('img/face.jpg'));
	});
}

function logoff() {
	var self = this;
	self.cookie(CONFIG('cookie'), '', '-1 day');
	self.user.logoff();
	self.redirect('/');
}

function view_login() {
	var self = this;

	if (!self.query.token) {
		self.view('login');
		return;
	}

	GETSCHEMA('Login').workflow2('token', self, function(err, response) {
		if (err)
			return self.view('login');
		self.redirect('/account/?password=1');
	});
}