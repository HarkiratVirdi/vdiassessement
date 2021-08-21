const category = {
  data() {
    return {
      errorMsg: "",
      successMsg: "",
      documents: [],
      loading: true,
      showEditModal: false,
      showAddModal: false,
      newDocumentName: "",
      currentDoc: {},
      newDoc: { name: "", category: this.$route.query.id },
    };
  },
  created: function () {
    this.getCategory();
  },
  watch: {
    "$route.query.id"() {
      (this.newDoc = {
        category: this.$route.query.id,
      }),
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

    formInfo(obj) {
      let fd = new FormData();
      console.log("obj", obj);
      for (let i in obj) {
        fd.append(i, obj[i]);
      }
      console.log("fd", fd);
      return fd;
    },

    updateDocument() {
      console.log("current Doc", this.currentDoc.id);
      let formData = this.formInfo(this.currentDoc);
      axios
        .post("http://localhost/interview/process.php?action=update", formData)
        .then((response) => {
          this.currentDoc = {};
          console.log("response", response);
        })
        .catch((e) => {
          console.log("e", e);
        });
    },

    addDocument() {
      let formData = this.formInfo(this.newDoc);
      console.log("form", formData);
      console.log("this.doc", this.newDoc);
      axios
        .post("http://localhost/interview/process.php?action=create", formData)
        .then((response) => {
          if (response.data.error) {
            this.errorMsg = response.data.error;
          } else {
            this.documents = response.data.documents;
            this.getCategory();
          }
        });
    },
    deleteDocument() {
      console.log("current doc", this.currentDoc.id);
      let formData = this.formInfo(this.currentDoc);
      axios
        .post("http://localhost/interview/process.php?action=delete", formData)
        .then((response) => {
          this.currentDoc = {};
          console.log("response", response);
          this.getCategory();
        })
        .catch((e) => {
          console.log("e", e);
        });
    },
    setCurrentDocument(doc) {
      this.currentDoc = doc;
    },
  },

  template: `<div>
    <button class="btn btn-secondary my-3" v-on:click="showAddModal = true;">Add New Document</button>
  <div class="row">
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
                      v-on:click="showEditModal = true; setCurrentDocument(document); updateDocument()"
                      ><i class="fas fa-edit"> </i
                    ></span>
                  </td>
                  <td>
                    <span
                      class="text-danger"
                        style="cursor: pointer"
                         v-on:click="setCurrentDocument(document);deleteDocument()"
                      ><i class="fas fa-trash"> </i
                    ></span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
<div id="overlay" v-if="showEditModal">
        <div class="modal-dialog" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%;">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit User</h5>
              <button type="button" class="close">
                <span aria-hidden="true" v-on:click="showEditModal = false">
                  &times;</span
                >
              </button>
            </div>

            <div class="modal-body p-4">
              <form action="#" method="post">
                <div class="form-group">
                  <input
                    type="text"
                    name="name"
                    class="form-control form-control-lg"
                    placeholder="Name"
                  />
                </div>
                <div class="form-group">
                  <button
                    class="btn btn-info btn-block btn-lg"
                    @click="showEditModal = false"
                  >
                    Update Document
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>



<div id="overlay" v-if="showAddModal">
        <div class="modal-dialog" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%;">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add Document</h5>
              <button type="button" class="close">
                <span aria-hidden="true" v-on:click="showAddModal = false">
                  &times;</span
                >
              </button>
            </div>

            <div class="modal-body p-4">
              <form action="#" method="post">
                <div class="form-group">
                  <input
                    type="text"
                    name="name"
                    class="form-control form-control-lg"
                    placeholder="Name"
                    v-model="newDoc.name"
                  />
                </div>
                <div class="form-group">
                  <button
                    class="btn btn-info btn-block btn-lg"
                    @click="showAddModal = false; addDocument();"
                  >
                    Add Document
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
       </div> 
        `,
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
