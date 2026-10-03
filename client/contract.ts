export const contract = {
  "master": {
    "create": {
      "method": "post",
      "description": "Create a new master password",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "password": {
              "type": "string"
            }
          },
          "required": [
            "password"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "CREATED": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "recovery_key": {
              "type": "string"
            }
          },
          "required": [
            "recovery_key"
          ],
          "additionalProperties": false
        }
      }
    },
    "getChallenge": {
      "method": "get",
      "description": "Retrieve challenge token for master password authentication",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {},
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "string"
        }
      }
    },
    "getWrappedVEK": {
      "method": "get",
      "description": "Get the wrapped VEK for the authenticated user",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {},
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "wrapped_vek": {
              "type": "string"
            }
          },
          "required": [
            "wrapped_vek"
          ],
          "additionalProperties": false
        }
      }
    },
    "hasMasterPassword": {
      "method": "get",
      "description": "Check if a master password has been configured",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {},
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "boolean"
        }
      }
    },
    "updateWrappedVEK": {
      "method": "post",
      "description": "Update the wrapped VEK (used during master password rotation)",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "password": {
              "type": "string"
            },
            "new_password": {
              "type": "string"
            },
            "new_wrapped_vek": {
              "type": "string"
            }
          },
          "required": [
            "password",
            "new_password",
            "new_wrapped_vek"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "recovery_key": {
              "type": "string"
            }
          },
          "required": [
            "recovery_key"
          ],
          "additionalProperties": false
        }
      }
    },
    "verify": {
      "method": "post",
      "description": "Verify master password against stored hash",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "password": {
              "type": "string"
            }
          },
          "required": [
            "password"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "boolean"
        }
      }
    }
  },
  "entries": {
    "create": {
      "method": "post",
      "description": "Create a new password entry with pre-encrypted password",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "website": {
              "type": "string"
            },
            "username": {
              "type": "string"
            },
            "password": {
              "type": "string"
            },
            "icon": {
              "type": "string"
            },
            "color": {
              "type": "string"
            },
            "category": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "rotation_interval": {
              "type": "number"
            }
          },
          "required": [
            "name",
            "website",
            "username",
            "password",
            "icon",
            "color",
            "rotation_interval"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "NO_CONTENT": true
      }
    },
    "list": {
      "method": "get",
      "description": "Get all password entries with sorting",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {},
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string",
                "format": "uuid",
                "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
              },
              "name": {
                "type": "string"
              },
              "website": {
                "type": "string"
              },
              "username": {
                "type": "string"
              },
              "password": {
                "type": "string"
              },
              "icon": {
                "type": "string"
              },
              "color": {
                "type": "string"
              },
              "pinned": {
                "type": "boolean"
              },
              "category": {
                "anyOf": [
                  {
                    "type": "string",
                    "format": "uuid",
                    "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "last_password_updated": {
                "type": "string",
                "format": "date-time"
              },
              "rotation_interval": {
                "type": "integer",
                "minimum": -2147483648,
                "maximum": 2147483647
              },
              "created": {
                "type": "string",
                "format": "date-time"
              },
              "updated": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "id",
              "name",
              "website",
              "username",
              "password",
              "icon",
              "color",
              "pinned",
              "category",
              "last_password_updated",
              "rotation_interval",
              "created",
              "updated"
            ],
            "additionalProperties": false
          }
        }
      }
    },
    "remove": {
      "method": "post",
      "description": "Delete a password entry",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "NO_CONTENT": true
      }
    },
    "togglePin": {
      "method": "post",
      "description": "Toggle pin status of a password entry",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "NO_CONTENT": true
      }
    },
    "update": {
      "method": "post",
      "description": "Update an existing password entry",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        },
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "website": {
              "type": "string"
            },
            "username": {
              "type": "string"
            },
            "password": {
              "type": "string"
            },
            "icon": {
              "type": "string"
            },
            "color": {
              "type": "string"
            },
            "category": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "rotation_interval": {
              "type": "number"
            },
            "password_changed": {
              "type": "boolean"
            }
          },
          "required": [
            "name",
            "website",
            "username",
            "password",
            "icon",
            "color",
            "rotation_interval"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "NO_CONTENT": true
      }
    }
  },
  "categories": {
    "create": {
      "method": "post",
      "description": "Create a new password category",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "icon": {
              "type": "string"
            },
            "color": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "icon",
            "color"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "CREATED": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid",
              "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
            },
            "name": {
              "type": "string"
            },
            "color": {
              "type": "string"
            },
            "icon": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "name",
            "color",
            "icon"
          ],
          "additionalProperties": false
        }
      }
    },
    "list": {
      "method": "get",
      "description": "Get the list of password categories",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {},
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              },
              "name": {
                "type": "string"
              },
              "color": {
                "type": "string"
              },
              "icon": {
                "type": "string"
              },
              "amount": {
                "type": "number"
              }
            },
            "required": [
              "id",
              "name",
              "color",
              "icon",
              "amount"
            ],
            "additionalProperties": false
          }
        }
      }
    },
    "remove": {
      "method": "post",
      "description": "Delete a password category",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "boolean"
        }
      }
    },
    "update": {
      "method": "post",
      "description": "Update an existing password category",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        },
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "icon": {
              "type": "string"
            },
            "color": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "icon",
            "color"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid",
              "pattern": "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"
            },
            "name": {
              "type": "string"
            },
            "color": {
              "type": "string"
            },
            "icon": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "name",
            "color",
            "icon"
          ],
          "additionalProperties": false
        }
      }
    }
  },
  "recovery": {
    "generate": {
      "method": "post",
      "description": "Generate a recovery key that can unlock the VEK",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "password": {
              "type": "string"
            }
          },
          "required": [
            "password"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "recovery_key": {
              "type": "string"
            }
          },
          "required": [
            "recovery_key"
          ],
          "additionalProperties": false
        }
      }
    },
    "recover": {
      "method": "post",
      "description": "Recover account using recovery key and set a new master password",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "recovery_key": {
              "type": "string"
            },
            "new_password": {
              "type": "string"
            }
          },
          "required": [
            "recovery_key",
            "new_password"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "NO_CONTENT": true
      }
    },
    "status": {
      "method": "get",
      "description": "Check if a recovery key has been configured",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {},
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "has_recovery_key": {
              "type": "boolean"
            }
          },
          "required": [
            "has_recovery_key"
          ],
          "additionalProperties": false
        }
      }
    }
  }
} as const

export default contract
