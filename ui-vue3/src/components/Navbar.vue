<template>

<div id="navbar">
    <nav class="navbar fixed-top navbar-expand-lg navbar-light bg-light">
        <div class="container">
            <a class="navbar-brand" id="brand" href="/">Coorporate Carpooling Service</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsGrp6" aria-controls="navbarsGrp6" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarsGrp6">
                <ul class="navbar-nav mr-auto">

                </ul>
                <span class="nav-item active">
                        <a class="nav-link" id="home-link" href="/">
                            Home
                            <span class="sr-only"></span>
                        </a>
                    </span>
                <span class="nav-item active">
                        <a class="nav-link" href="/test">
                            Test
                            <span class="sr-only"></span>
                        </a>
                </span>
                <span class="nav-item active">
                        <a class="nav-link" href="/register">
                            Sign Up
                            <span class="sr-only"></span>
                        </a>
                </span>
                <span class="nav-item active">
                        <a class="nav-link" href="/login">
                            Sign In
                            <span class="sr-only"></span>
                        </a>
                </span>
                <span class="nav-item active">
                        <a class="nav-link" href="/logout">
                            Log Out
                            <span class="sr-only"></span>
                        </a>
                </span>
            </div>
        </div>
    </nav>
</div>

</template>

<script>
export default {
    
}
</script>

<style scoped>
#brand{
    color: #007bff;
    font-weight: bolder;
}

.nav-link:hover {
    color: #191654;
}

#home-link:hover{
    color: #191654;

}

.navbar-light .navbar-nav .active>.nav-link, .navbar-light .navbar-nav .nav-link.active, .navbar-light .navbar-nav .nav-link.show, .navbar-light .navbar-nav .show>.nav-link {
    color: #43C6AC;
    font-weight: bold;
}

</style>