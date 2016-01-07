module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		less: {
			css: {
				files: [{
					expand: true,
					cwd: "src/css",
					src: "**/*.less",
					dest: "build/css"
				}]
			}
		},
		eslint: {
			target: {
				src: ["src/js/**/*.js"]
			}
		},
		concat: {
			css: {
				files: {
					"dist/end2end.css": [
						"build/css/base/*.css",
						"build/css/grid/*.css",
						"build/css/components/*.css"
					]
				}
			},
			js: {
				files: {
					"dist/end2end.js": [
						"src/js/end2end.js",
						"src/js/components/*.js"
					]
				}
			}
		},
		ngAnnotate: {
			target: {
				files: {
					"dist/end2end.js": ["dist/end2end.js"]
				}
			}
		},
		ngtemplates: {
			end2end: {
				src: "src/templates/*.html",
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
				files: ["Gruntfile.js"]
			},
			css: {
				files: ["src/css/**/*.less"],
				tasks: ["newer:less", "concat:css"]
			},
			js: {
				files: ["src/js/**/*.js"],
				tasks: ["newer:eslint", "concat:js", "ngannotate", "ngtemplates"]
			},
			templates: {
				files: ["src/templates/*.js"],
				tasks: ["ngtemplates"]
			}
		},
		eslint: {
			target: {
				src: ["src/js/**/*.js"]
			}
		},
		bump: {
			options: {
				files: ["package.json", "bower.json"],
				updateConfigs: ["pkg"],
				commitFiles: ["package.json", "bower.json"],
				pushTo: "origin"
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-angular-templates');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-bump');

	// Default task(s).
	grunt.registerTask('default', ["css", "js"]);
	grunt.registerTask('css', ["less", "concat:css"]);
	grunt.registerTask("js", ["eslint", "concat:js", "ngannotate", "ngtemplates"]);

};
