module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
		minified: {
			files: {
				"dist/dialog.min.js": "dist/dialog.js"
			},
			options: {
				mangle: true,
				compress: true,
				sourceMap: true,
			}
		}
    },
	less: {
		compile: {
			files: {
				"grid.css": "grid.less"
			}
		},
		minified: {
			files: {
				"dist/dialog.min.css": "dialog.less"
			},
			options: {
				compress: true,
				sourceMap: true,
				sourceMapFilename: "dist/dialog.min.css.map",
				sourceMapURL: "dialog.min.css.map"
			}
		}
	},
	eslint: {
		source: {
			src: "dialog.js"
		}
	},
	copy: {
		dist: {
			files: {
				"dist/dialog.js": "dialog.js"
			}
		}
	},
	ngtemplates: {
		template: {
			src: "templates/**.html",
			dest: "dist/dialog.js",
			options: {
				htmlmin: {
					collapseWhitespace: true,
					removeComments: true
				},
				module: "ezdialog",
				append: true
			}
		}
	},
	watch: {
		grunt: {
			files: "Gruntfile.js"
		},
		less: {
			files: "*.less",
			tasks: "less:compile"
		}
	}
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ["eslint", "copy", "less", "ngtemplates", 'uglify']);

};