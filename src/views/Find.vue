<template>
    <div class="find">
        <Nav :title='title' :isChange='true'/>
        
    </div>
</template>

<script>
import Nav from '../components/Nav'
export default {
    data(){
        return{
            title:'发现'
        }
    },
    components:{
        Nav
    }
}
</script>