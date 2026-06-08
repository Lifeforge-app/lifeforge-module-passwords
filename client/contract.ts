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
        "NO_CONTENT": true
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
    "validateOTP": {
      "method": "post",
      "description": "Validate OTP for master password operations",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "otp": {
              "type": "string"
            },
            "otpId": {
              "type": "string"
            }
          },
          "required": [
            "otp",
            "otpId"
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
      "description": "Create a new encrypted password entry",
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
            "id": {
              "type": "string"
            },
            "collectionId": {
              "type": "string"
            },
            "collectionName": {
              "type": "string"
            },
            "master": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "website",
            "username",
            "password",
            "icon",
            "color",
            "id",
            "collectionId",
            "collectionName",
            "master"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "NO_CONTENT": true
      }
    },
    "decrypt": {
      "method": "post",
      "description": "Decrypt and retrieve a password entry.",
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
            },
            "master": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "master"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "string"
        },
        "NOT_FOUND": true
      }
    },
    "exportEntries": {
      "method": "post",
      "description": "Export all password entries decrypted",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "master": {
              "type": "string"
            }
          },
          "required": [
            "master"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "array",
          "items": {
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
              "pinned": {
                "type": "boolean"
              },
              "created": {
                "type": "string"
              },
              "updated": {
                "type": "string"
              },
              "id": {
                "type": "string"
              },
              "collectionId": {
                "type": "string"
              },
              "collectionName": {
                "type": "string"
              }
            },
            "required": [
              "name",
              "website",
              "username",
              "password",
              "icon",
              "color",
              "pinned",
              "created",
              "updated",
              "id",
              "collectionId",
              "collectionName"
            ],
            "additionalProperties": false
          }
        }
      }
    },
    "getChallenge": {
      "method": "get",
      "description": "Retrieve challenge token for password encryption",
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
                "type": "string"
              },
              "name": {
                "type": "string"
              },
              "icon": {
                "type": "string"
              },
              "color": {
                "type": "string"
              },
              "website": {
                "type": "string"
              },
              "username": {
                "type": "string"
              },
              "pinned": {
                "type": "boolean"
              },
              "updated": {
                "type": "string"
              }
            },
            "required": [
              "id",
              "name",
              "icon",
              "color",
              "website",
              "username",
              "pinned",
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
        "NO_CONTENT": true,
        "NOT_FOUND": true
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
        "NO_CONTENT": true,
        "NOT_FOUND": true
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
            "id": {
              "type": "string"
            },
            "collectionId": {
              "type": "string"
            },
            "collectionName": {
              "type": "string"
            },
            "master": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "website",
            "username",
            "password",
            "icon",
            "color",
            "id",
            "collectionId",
            "collectionName",
            "master"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "NO_CONTENT": true,
        "NOT_FOUND": true
      }
    }
  }
} as const

export default contract
