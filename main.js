const category = {
  data() {
    return {
      errorMsg: "",
      successMsg: "",
      documents: [],
      loading: true,
    };
  },
  created: function () {
    this.getCategory();
  },
  watch: {
    "$route.query.id"() {
      this.getCategory();
    },
  },
  methods: {
    getCategory() {
      axios
        .get(
          `http://localhost/interview/process.php?id=${this.$route.query.id}`
        )
        .then((response) => {
          console.log("response", response);
          if (response.data.error) {
            this.errorMsg = response.data.message;
            this.loading = false;
          } else {
            this.documents = response.data.documents;
            this.loading = true;
            console.log("documents", this.documents);
          }
        });
    },
  },

  template: `<div class="row">
          <div class="col-lg-12">
            <table class="table table-bordered table-striped">
              <thead>
                <tr class="text-center bg-dark text-light">
                  <th>ID</th>
                  <th>Category_id</th>
                  <th>Name</th>
                  <th>Created_at</th>
                  <th>Updated_at</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
           
                <tr class="text-center" v-for="document in documents">
                  <td>{{ document.id }}</td>
                  <td>{{ document.category_id}}</td>
                  <td>{{ document.name}}</td>
                  <td>{{ document.created_at}}</td>
                  <td>{{ document.updated_at}}</td>
                  <td>
                    <span
                      class="text-success"
                      style="cursor: pointer"
                      @click="showEditModal = true"
                      ><i class="fas fa-edit"> </i
                    ></span>
                  </td>
                  <td>
                    <span
                      class="text-danger"
                        style="cursor: pointer"
                      @click="showDeleteModal = true"
                      ><i class="fas fa-trash"> </i
                    ></span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>`,
};

const router = new VueRouter({
  routes: [{ path: "/category", component: category }],
});

var app = new Vue({
  router,
  el: "#app",
  data() {
    return {
      errorMsg: "",
      successMsg: "",
      showDropdown: false,
      categories: [],
    };
  },
  mounted: function () {
    this.getAllCategories();
  },
  methods: {
    getAllCategories() {
      axios
        .get("http://localhost/interview/process.php/")
        .then(function (response) {
          console.log("response", response);
          if (response.data.error) {
            app.errorMsg = response.data.message;
          } else {
            app.categories = response.data.categories;
            console.log("categoryes", app.categories);
          }
        });
    },
  },
});
