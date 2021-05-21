<template>
  <div class="container">
      <div class="col">
        <div class="box">
          <q-btn color="blue-3" unelevated label="Reset" rounded icon="fas fa-trash" no-caps
                 @click="$refs.dynamicForm.resetInput()" />
          Parent From component: {{formData}}
          <dynamicForm :blocks="blocks" :metaInfoT="metaTitle" :metaInfoD="metaDescription" form-tyspe="formHorizontal"
                       @submit="(val) => formData = val" ref="dynamicForm" />
        </div>
    </div>
  </div>
</template>
<script>
    import DynamicForm from '@imagina/qsite/_components/master/dynamicForm'

    export default {
        name: 'app',
        components: {
            DynamicForm
        },
        data: () => ({
                metaTitle: "Wizard Default Title",
                metaDescription: "Wizard Default Description: Lorem ipsum dolor sit amet, consectetur adipiscing " +
                    "elit. Nullam tincidunt dapibus dapibus. Sed imperdiet, arcu et dignissim lobortis, sem sem " +
                    "fringilla dui, id fringilla erat lectus sit amet turpis. ",
                formData: {}
            }
        ),
        computed: {
            //Steps to form
            blocks() {
                return [
                    {
                        title: 'Block #1',
                        description: 'Description Block #1',
                        fields: {
                            firstName: {
                                value: null,
                                type: 'input',
                                colClass: 'col-6',
                                props: {
                                    label: `${this.$trp('ui.form.firstName')}`,
                                }
                            },
                            lastName: {
                                value: null,
                                type: 'input',
                                props: {
                                    label: `${this.$trp('ui.form.lastName')}*`,
                                    rules: [val => !!val || this.$tr('ui.message.fieldRequired')],
                                }
                            },
                            homePhone: {
                                value: null,
                                type: 'input',
                                colClass: 'col-6',
                                props: {
                                    label: `${this.$trp('ui.form.homePhone')}*`,
                                    mask: 'phone',
                                    unmaskedValue: true,
                                    rules: [
                                        val => !!val || this.$tr('ui.message.fieldRequired'),
                                        val => !val || val.length == 10 || this.$tr('ui.message.fieldMinLeng', {num: 10})
                                    ],
                                }
                            },
                            email: {
                                value: null,
                                type: 'input',
                                colClass: 'col-6',
                                props: {
                                    label: `${this.$trp('ui.form.email')}`,
                                }
                            },
                            language: {
                                value: 'English',
                                type: 'select',
                                colClass: 'col-6',
                                props: {
                                    label: `${this.$trp('ui.form.language')}`,
                                    rules: [val => !!val || this.$tr('ui.message.fieldRequired')],
                                    options: [
                                        {label: 'Spanish', value: 0},
                                        {label: 'Aleman', value: 1},
                                        {label: 'French', value: 2},
                                    ]
                                },
                            },
                            maritalId: {
                                value: null,
                                type: 'select',
                                colClass: 'col-6',
                                props: {
                                    label: `${this.$trp('ui.form.maritalStatus')}`,
                                    options: [
                                        {label: 'Single', value: 0},
                                        {label: 'Married', value: 1},
                                        {label: 'Divorced', value: 2},
                                    ]
                                },
                            },
                            type: {
                                value: 'Select Any',
                                type: 'select',
                                colClass: 'col-6',
                                props: {
                                    label: this.$tr('ui.form.type'),
                                    options: [
                                        {label: 'Text', value: 0},
                                        {label: 'Number', value: 1},
                                        {label: 'Email', value: 2},
                                        {label: 'Text Area', value: 3},
                                    ]
                                }
                            }
                        }
                    },
                    {
                        title: 'Block #2',
                        description: 'Description Block #2',
                        fields: {
                            appointmentDate: {
                                value: null,
                                type: 'date',
                                colClass: 'col-6',
                                props: {
                                    label: `${this.$trp('ui.form.appointmentDate')}*`,
                                    mask: 'YYYY-MM-DD',
                                    // rules: [val => !!val || this.$tr('ui.message.fieldRequired')],
                                    options: (date) => {
                                        return date >= this.$moment().format('YYYY/MM/DD')
                                    }
                                },
                            },
                            appointmentTime: {
                                value: null,
                                type: 'hour',
                                props: {
                                    label: `${this.$trp('ui.form.appointmentTime')}*`,
                                    rules: [val => !!val || this.$tr('ui.message.fieldRequired')],
                                },
                            },
                            productId: {
                                value: 'Windows/Doors',
                                type: 'select',
                                colClass: 'col-6',
                                props: {
                                    label: `${this.$trp('ui.form.product')}*`,
                                    rules: [val => !!val || this.$tr('ui.message.fieldRequired')],
                                    options: [
                                        {label: 'Roofing', value: 0},
                                        {label: 'Bath', value: 1},
                                        {label: 'Kitchen', value: 2},
                                        {label: 'Home Depot', value: 3},
                                    ]
                                },
                            },
                            address: {
                                value: null,
                                type: 'input',
                                colClass: 'col-6',
                                props: {
                                    label: `${this.$trp('ui.form.address')}`,
                                }
                            },
                            customerComments: {
                                value: null,
                                type: 'input',
                                colClass: 'col-12',
                                props: {
                                    label: `${this.$trp('ui.form.comment')}`,
                                    type: 'textarea',
                                    rows: 3
                                },
                            }
                        }
                    },
                    {
                        title: 'Block #3',
                        description: 'Description Block #2',
                        fields: {
                            appointmentDate: {
                                value: null,
                                type: 'date',
                                colClass: 'col-6',
                                props: {
                                    label: `${this.$trp('ui.form.appointmentDate')}*`,
                                    mask: 'YYYY-MM-DD',
                                    // rules: [val => !!val || this.$tr('ui.message.fieldRequired')],
                                    options: (date) => {
                                        return date >= this.$moment().format('YYYY/MM/DD')
                                    }
                                },
                            },
                            appointmentTime: {
                                value: null,
                                type: 'hour',
                                props: {
                                    label: `${this.$trp('ui.form.appointmentTime')}*`,
                                    // rules: [val => !!val || this.$tr('ui.message.fieldRequired')],
                                },
                            },
                            productId: {
                                value: 'Windows/Doors',
                                type: 'select',
                                colClass: 'col-6',
                                props: {
                                    label: `${this.$trp('ui.form.product')}*`,
                                    rules: [val => !!val || this.$tr('ui.message.fieldRequired')],
                                    options: [
                                        {label: 'Roofing', value: 0},
                                        {label: 'Bath', value: 1},
                                        {label: 'Kitchen', value: 2},
                                        {label: 'Home Depot', value: 3},
                                    ]
                                },
                            },
                            address: {
                                value: null,
                                type: 'input',
                                colClass: 'col-6',
                                props: {
                                    label: `${this.$trp('ui.form.address')}`,
                                }
                            },
                            customerComments: {
                                value: null,
                                type: 'input',
                                colClass: 'col-12',
                                props: {
                                    label: `${this.$trp('ui.form.comment')}`,
                                    type: 'textarea',
                                    rows: 3
                                },
                            }
                        }
                    }
                ]
            },
        }
    }
</script>
<style>

</style>
