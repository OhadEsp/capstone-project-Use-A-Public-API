
/**
 * funtion for GET homePage route.
 */
const getHomePage = ((req, res) => {
    res.render("index.ejs", {
        ejsContent: "homePage.ejs"
    });
});

export default getHomePage;