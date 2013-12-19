module.exports = function(grunt) {
    grunt.initConfig({
        less: {
            development: {
                options: {
                    paths: ["./less"],
                    yuicompress: true
                },
                files: {
                    "./assets/css/bootstrap.css": "./less/bootstrap.less",
                    "./assets/css/docs.css": "./less/docs.less"
                }
            }
        },
        watch: {
            files: "./less/*.less",
            tasks: ["less"]
        }
    });
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', 'watch');
};