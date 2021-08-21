const category = {
  data() {
    return {
      errorMsg: "",
      successMsg: "",
      documents: [],
      showEditModal: false,
      showAddModal: false,
      newDocumentName: "",
      currentDoc: {},
      updateDocName: "",
      newDoc: { name: "", category: this.$route.query.id },
    };
  },
  mounted: function () {
    this.getCategory();
  },
  watch: {
    //if query id is changed run the function getCategory and set category to id
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
          if (response.data.error) {
            this.errorMsg = response.data.message;
          } else {
            this.documents = response.data.documents;
            this.currentCategory = response.data.id;
          }
        });
    },

    formInfo(obj) {
      let formData = new FormData();
      for (let i in obj) {
        formData.append(i, obj[i]);
      }
      return formData;
    },

    updateDocument() {
      let formData = this.formInfo({
        ...this.currentDoc,
        category: this.$route.query.id,
        name: this.updateDocName,
      });
      axios
        .post("http://localhost/interview/process.php?action=update", formData)
        .then((response) => {
          if (response.data.error) {
            this.errorMsg = response.data.error;
          } else {
            //after updating set the current Doc to empty.
            this.currentDoc = {};
            //run the function again to show updated ones.
            this.getCategory();
          }
        });
    },

    addDocument() {
      let formData = this.formInfo(this.newDoc);
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
      let formData = this.formInfo(this.currentDoc);
      axios
        .post("http://localhost/interview/process.php?action=delete", formData)
        .then((response) => {
          this.currentDoc = {};
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
  <h3 class="mt-2 text-center">Current Category {{this.newDoc.category}}</h3>
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
                      v-on:click="showEditModal = true; setCurrentDocument(document);"
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
                    v-model="updateDocName"
                  />
                </div>
                <div class="form-group">
                  <button
                    class="btn btn-dark btn-block btn-lg"
                    @click="showEditModal = false; updateDocument();"
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
                    class="btn btn-dark btn-block btn-lg"
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
