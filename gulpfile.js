var elixir = require('laravel-elixir');
require('laravel-elixir-browsersync-official');

elixir.config.assetsPath = 'src';
elixir.config.publicPath = 'dist';

elixir(function(mix) {
    mix.sass('app.scss')
        .webpack('app.js')
        .browserSync({
            files: ['dist/*.html', 'src/sass/*.scss', 'src/js/*.js'],
            proxy: undefined,
            server: {
                baseDir: "dist"
            }
        });
});