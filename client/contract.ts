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
    "masterChallenge": "c797fe36-f11c-47b2-9241-ae3e3cbb4da7",
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
        },
        "UNAUTHORIZED": true
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
            "category"
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
              "password": {
                "type": "string"
              },
              "pinned": {
                "type": "boolean"
              },
              "last_password_updated": {
                "type": "string"
              },
              "category": {
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
              "password",
              "pinned",
              "last_password_updated",
              "category"
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
            "category": {
              "type": "string"
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
            "category"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "NO_CONTENT": true,
        "NOT_FOUND": true
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
            "name": {
              "type": "string"
            },
            "color": {
              "type": "string"
            },
            "icon": {
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
            "color",
            "icon",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        },
        "CONFLICT": true
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
              "color",
              "icon",
              "amount",
              "id",
              "collectionId",
              "collectionName"
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
        },
        "NOT_FOUND": true
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
            "name": {
              "type": "string"
            },
            "color": {
              "type": "string"
            },
            "icon": {
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
            "color",
            "icon",
            "id",
            "collectionId",
            "collectionName"
          ],
          "additionalProperties": false
        },
        "CONFLICT": true,
        "NOT_FOUND": true
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
        },
        "UNAUTHORIZED": true
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
        "NO_CONTENT": true,
        "BAD_REQUEST": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "string"
        }
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
