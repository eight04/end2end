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
		gridCore: {
			files: {
				"build/gridCore.css": "src/gridCore.less"
			}
		},
		components: {
			expand: true,
			cwd: "src/components",
			src: "*.less",
			dest: "build/components",
			ext: ".css"
		},
		main: {
			expand: true,
			cwd: "src/",
			src: ["*.less", "!gridCore.less", "!vars.less", "!mixins.less"],
			dest: "build/",
			ext: ".css"
		}
	},
	eslint: {
		end2end: {
			src: ["*.js", "!Gruntfile.js"]
		}
	},
	copy: {
		dist: {
			files: {
				"dist/end2end.js": "end2end.js"
			}
		}
	},
	ngtemplates: {
		end2end: {
			src: "templates/**.html",
			dest: "dist/end2end.js",
			options: {
				htmlmin: {
					collapseWhitespace: true,
					removeComments: true
				},
				append: true
			}
		}
	},
	watch: {
		grunt: {
			files: "Gruntfile.js"
		},
		gridCore: {
			files: "src/gridCore.less",
			tasks: "less:gridCore"
		},
		main: {
			files: "src/*.less",
			tasks: "less:main"
		},
		components: {
			files: "src/components/*.less",
			tasks: "less:components"
		},
		js: {
			files: ["*.js", "templates/*"],
			tasks: "dist-js"
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
  grunt.registerTask('dist', ["eslint", "less", "copy", "ngtemplates"]);
  grunt.registerTask('dist-js', ["eslint", "copy", "ngtemplates"]);

};