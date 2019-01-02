
class UserModel {
    constructor(
        id = 0,
        bio = null,
        country  = null,
        dateOfBirth,
        description  = null,
        email = null,
        firstName,
        gender = -1,
        language,
        lastName,
        middleName = null,
        livingAddress = null,
        loggedInBefore = false,
        phoneNumber = null,
        relationship = null,
        sexualOrientation = null,
        profileVersion = '1',
        userAuthenticationId
    ) {
        this.id = id;
        this.bio = bio;
        this.country = country;
        this.dateOfBirth = dateOfBirth;
        this.description = description;
        this.email = email;
        this.firstName = firstName;
        this.gender = gender;
        this.language = language;
        this.lastName = lastName;
        this.middleName = middleName;
        this.livingAddress = livingAddress;
        this.loggedInBefore = loggedInBefore;
        this.phoneNumber = phoneNumber;
        this.relationship = relationship;
        this.sexualOrientation = sexualOrientation;
        this.profileVersion = profileVersion;
        this.userAuthenticationId = userAuthenticationId;
    }
}

module.exports = UserModel;